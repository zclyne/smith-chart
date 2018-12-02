/*-----------------------------------------------------------------------

Selection:

Encapsulates the constrained pair of values {gamma, z} representing one
"point" on the Smith Chart. When either of the values is set, the other
is appropriately updated according to the relations:

z = (1 + gamma) / (1 - gamma)
gamma = (z - 1) / (z + 1)

-----------------------------------------------------------------------*/


function Selection(attr) {

    // Selection({gamma: <complex>})    init by gamma
    // Selection({z: <complex>})        init by z

    this.one = new Complex(1, 0)

    try {
        if (attr.gamma) {
            this.gamma = attr.gamma.copy()
        } else if (attr.z) {
            this.z = attr.z.copy()
            this.gamma = this._calcGamma_Z(this.z)
        } else if (attr.y) {
            this.y = attr.y.copy()
            this.gamma = this._calcGamma_Y(this.y)
        }
        this.rho = this._calcrho(this.gamma)
        this.z = this._calcZ(this.gamma)
        this.y = this._calcY(this.gamma)


    } catch (err) {
        this.gamma = new Complex(0, 0)
        this.rho = 0
        this.z = new Complex(1, 0)
        this.y = new Complex(1, 0)
    }
}

Selection.prototype.setGamma = function (gamma) {
    this.gamma = gamma
    this.rho = this._calcrho(this.gamma)
    this.z = this._calcZ(this.gamma)
    this.y = this._calcY(this.gamma)

}

Selection.prototype.setZ = function (z) {
    this.z = z
    this.gamma = this._calcGamma_Z(this.z)
    this.y = this._calcY(this.gamma)
}

Selection.prototype.copy = function() {
    return new Selection({
        gamma: this.gamma.copy()
    })
}

Selection.prototype._calcrho = function(gamma) {
    return (1 + gamma.mag())/(1 - gamma.mag()) // rho = ..
}

Selection.prototype._calcZ = function(gamma) {
    return gamma.add(this.one).mul(gamma.neg().add(this.one).inv()) // Z = (1 + gamma) / (1 - gamma)
}

Selection.prototype._calcY = function(gamma) {
    return gamma.neg().add(this.one).mul(gamma.add(this.one).inv()) // Y = (1 - gamma) / (1 + gamma)
}

Selection.prototype._calcGamma_Z = function (z) {
    return z.add(this.one.neg()).mul(z.add(this.one).inv()) // gamma = (z - 1) / (z + 1)
}

Selection.prototype._calcGamma_Y = function (y) {
    return y.neg().add(this.one).mul(y.add(this.one).inv()) // gamma = (1 - y) / (1 + y)
}


// We will use classy.js for these classes, since they require subclasses

/*-----------------------------------------------------------------------

Component:

One element in the impedance matching process. Could be, for example,
a transmission line of certain length, a lumped series capacitor or
inductor, or a lumped shunt capacitor or inductor.

When adding one of the elements, their ability to change gamma/z is constrained
to moving along one particular path of the smith chart. Sublcasses will implement
this constraint in the snapCursor method - this takes a raw cursor gotten
from the mouse point and snaps it to the closest constrained value.

Each component should posesses a references to the Z-value of the last component
on the chain when initialized. Then, the physical attributes determine a
delta-Z that gets added to the previous Z to give the current cursor, culminating
when the user makes a final selection and adds another component to the chain.

-----------------------------------------------------------------------*/

Component = Class.$extend({

    __init__: function () {

        this.desc = "Free selection"

        this.physAttributes = {}

        this.previousZ = null

        this.cursor = new Selection()
        this.selection = null

    },

    snapCursor: function (cursor) {

        // If the movement is constrained, constrain it

        this.cursor = cursor
    }
})